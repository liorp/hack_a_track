from __future__ import annotations

from hashlib import sha256
from typing import Union

from django.contrib.auth.models import User
from django.db import models
from django.db.models import F, Max
from django.utils.timezone import now


class Competition(models.Model):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=False)
    start_time = models.DateTimeField(default=now)
    end_time = models.DateTimeField(default=now)

    class Meta:
        app_label = "hack_a_track"

    def __str__(self):
        return self.name

    @property
    def last_stage(self) -> Union[Stage, None]:
        return self.stage_set.order_by("-number").first()

    @property
    def first_stage(self) -> Union[Stage, None]:
        return self.stage_set.order_by("number").first()

    def open_first_stage_for_group(self, group: Group):
        return StageInstance.objects.create(stage=self.first_stage, group=group)


class Stage(models.Model):
    number = models.IntegerField(blank=True)
    name = models.CharField(max_length=100)
    secret_code = models.CharField(max_length=100, default="", null=True)
    description = models.TextField(default="")
    competition = models.ForeignKey(Competition, null=True, on_delete=models.SET_NULL)

    class Meta:
        app_label = "hack_a_track"
        unique_together = ["number", "competition"]
        ordering = ['number']

    def __str__(self):
        return self.name + " " + str(self.number)

    @property
    def next_stage(self) -> Union[Stage, None]:
        try:
            return Stage.objects.get(number=self.number + 1, competition=self.competition)
        except Stage.DoesNotExist:
            return None

    @property
    def previous_stage(self) -> Union[Stage, None]:
        try:
            return Stage.objects.get(number=self.number - 1, competition=self.competition)
        except Stage.DoesNotExist:
            return None

    @property
    def is_last_stage(self) -> bool:
        return self.next_stage is None

    def unlock(self, secret_code: Union[bytes, str], participant: Participant) -> Union[StageInstance, None]:
        if isinstance(secret_code, str):
            secret_code = secret_code.encode()
        if sha256(secret_code).hexdigest() == sha256(self.secret_code.encode()).hexdigest():
            return StageInstance.objects.create(stage=self, group=participant.group)

    def delete(self, using=None, keep_parents=False):
        self.competition.stage_set.filter(number__gt=self.number).update(number=F("number") - 1)
        return super(Stage, self).delete(using, keep_parents)

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        if not self.number:
            # Make this stage the last stage
            self.number = self.competition.stage_set.aggregate(Max('number'))["number__max"] + 1 or 0
        if not self.id:
            self.competition.stage_set.filter(number__gte=self.number).update(
                number=F("number") + 1)
        return super(Stage, self).save(force_insert, force_update, using, update_fields)


class Group(models.Model):
    name = models.CharField(max_length=100)
    competition = models.ForeignKey(Competition, null=True, on_delete=models.SET_NULL)

    class Meta:
        app_label = "hack_a_track"

    def __str__(self):
        return self.name

    @property
    def current_stage_instance(self) -> Union[StageInstance, None]:
        if self.stageinstance_set.exists():
            return self.stageinstance_set.latest("stage__number")

    @property
    def finished_competition(self) -> bool:
        return self.competition.last_stage == self.current_stage_instance and self.current_stage_instance.finished

    def unlocked_stage(self, stage: Stage) -> bool:
        return stage.number <= self.current_stage_instance.stage.number

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        if not self.id:
            save = super(Group, self).save(force_insert, force_update, using, update_fields)
            self.competition.open_first_stage_for_group(self)
            return save
        return super(Group, self).save(force_insert, force_update, using, update_fields)


class StageInstance(models.Model):
    stage = models.ForeignKey(Stage, null=True, on_delete=models.CASCADE)
    finished = models.BooleanField(default=False)
    number_of_attempts = models.IntegerField(default=0)
    group = models.ForeignKey(Group, null=True, on_delete=models.SET_NULL)

    class Meta:
        app_label = "hack_a_track"


class Participant(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, null=True, on_delete=models.SET_NULL)

    class Meta:
        app_label = "hack_a_track"

    @property
    def competition(self):
        return self.group.competition

    @property
    def full_name(self):
        return self.first_name + " " + self.last_name

    @property
    def current_stage_instance(self) -> Union[StageInstance, None]:
        if self.group:
            return self.group.current_stage_instance

    def __str__(self):
        return self.full_name
