from djoser.conf import settings as djoser_settings
from djoser.serializers import UserCreateSerializer, User, UserSerializer
from rest_framework import serializers

from hack_a_track.models import Participant, Group, Competition, Stage, \
    StageInstance


class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage
        exclude = ["secret_code"]


class StageInstanceSerializer(serializers.ModelSerializer):
    stage = StageSerializer()

    class Meta:
        model = StageInstance
        fields = "__all__"


class GroupForCompetitionSerializer(serializers.ModelSerializer):
    current_stage_instance = StageInstanceSerializer()

    class Meta:
        model = Group
        fields = "__all__"


class CompetitionSerializer(serializers.ModelSerializer):
    group_set = GroupForCompetitionSerializer(many=True)
    stage_count = serializers.SerializerMethodField()

    def get_stage_count(self, obj):
        return obj.stage_set.count()

    class Meta:
        model = Competition
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer):
    competition = CompetitionSerializer()
    current_stage_instance = StageInstanceSerializer()

    class Meta:
        model = Group
        fields = "__all__"


class ParticipantSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    group = GroupSerializer()

    class Meta:
        model = Participant
        exclude = ["user"]


class CustomUserCreateSerializer(UserCreateSerializer):
    participant = ParticipantSerializer()

    class Meta:
        model = User
        fields = tuple(User.REQUIRED_FIELDS) + (
            djoser_settings.LOGIN_FIELD,
            djoser_settings.USER_ID_FIELD,
            "password",
            "participant"
        )

    def validate(self, attrs):
        participant = attrs.pop("participant")
        attrs = super(CustomUserCreateSerializer, self).validate(attrs)
        participant = ParticipantSerializer().validate(attrs=participant)
        attrs["participant"] = participant
        return attrs

    def create(self, validated_data):
        participant_data = validated_data.pop("participant")
        user = super(CustomUserCreateSerializer, self).create(validated_data)
        Participant.objects.create(user=user, **participant_data)
        return user


class CustomUserSerializer(UserSerializer):
    participant = ParticipantSerializer(required=False)

    class Meta:
        model = User
        fields = tuple(User.REQUIRED_FIELDS) + (
            djoser_settings.USER_ID_FIELD,
            djoser_settings.LOGIN_FIELD,
            "participant"
        )
        read_only_fields = (djoser_settings.LOGIN_FIELD,)
