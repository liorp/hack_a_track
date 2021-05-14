# Create your views here.
from pinax.eventlog.models import log
from rest_framework import viewsets, status
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from hack_a_track.models import Participant, Group, Stage, Competition, \
    StageInstance
from hack_a_track.serializers import ParticipantSerializer, GroupSerializer, CompetitionSerializer, \
    StageSerializer, StageInstanceSerializer, CustomUserSerializer


class CompetitionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows competitions to be viewed.
    """
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer

    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        pass


class StageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows stages to be viewed or edited.
    """
    queryset = Stage.objects.all()
    serializer_class = StageSerializer
    permission_classes = [permissions.IsAuthenticated]


class StageInstanceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows StageInstance to be viewed or edited.
    """
    queryset = StageInstance.objects.all()
    serializer_class = StageInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def unlock(self, request, pk=None):
        password = request.data["password"]
        participant = request.user.participant
        current_stage_instance = participant.group.current_stage_instance
        if current_stage_instance is not None:
            log(
                user=request.user,
                action="ATTEMPTED_STAGE",
                obj=current_stage_instance.stage,
                extra={
                    "group": participant.group.pk,
                    "competition": participant.competition.pk,
                }
            )
            current_stage_instance.number_of_attempts += 1
            current_stage_instance.save()
        if next_stage := current_stage_instance.stage.next_stage.unlock(password, participant):
            log(
                user=request.user,
                action="FINISHED_STAGE",
                obj=current_stage_instance.stage,
                extra={
                    "group": participant.group.pk,
                    "competition": participant.competition.pk,
                }
            )
            return Response(StageInstanceSerializer(next_stage).data, status=status.HTTP_200_OK)
        log(
            user=request.user,
            action="FAILED_STAGE",
            obj=current_stage_instance.stage,
            extra={
                "group": participant.group.pk,
                "competition": participant.competition.pk,
            }
        )
        return Response({"error": "This is not the right password!"},
                        status=status.HTTP_400_BAD_REQUEST)


class GroupViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows groups to be viewed.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class ParticipantViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows participants to be viewed or edited.
    """
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def change_group(self, request, pk=None):
        participant = self.get_object()
        old_group = participant.group
        if "group" not in request.data:
            return Response({"group": ["This field is required."]},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            new_group = Group.objects.get(pk=request.data["group"])
            participant.group = new_group
            participant.save()
            log(
                user=request.user,
                action="GROUP_CHANGED",
                obj=new_group,
                extra={
                    "old_group": old_group.pk,
                    "new_group": new_group.pk
                }
            )
            return Response(CustomUserSerializer(request.user).data, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({"group": [f"Group does not exist: {request.data['group']}."]},
                            status=status.HTTP_400_BAD_REQUEST)
        except Group.MultipleObjectsReturned:
            return Response({"group": [f"More than one group exists: {request.data['group']}."]},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def current_stage_instance(self, request, pk=None):
        participant = self.get_object()
        return Response(StageInstanceSerializer(participant.current_stage_instance).data, status=status.HTTP_200_OK)
