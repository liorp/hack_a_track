from django.contrib import admin

# Register your models here.
from hack_a_track.models import Competition, Stage, Group, StageInstance, Participant


class StageAdmin(admin.ModelAdmin):
    list_filter = ['competition']


admin.site.register(Competition)
admin.site.register(Stage, StageAdmin)
admin.site.register(Group)
admin.site.register(StageInstance)
admin.site.register(Participant)
