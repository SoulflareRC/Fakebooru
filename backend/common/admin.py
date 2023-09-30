from django.contrib import admin

# Register your models here.

from django.contrib import admin
from . import models
class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('thumb', 'preview','hash')
    list_display = ["uploader",
                    # "score_avg","score_cnt",
                    "rating",'publish_date',"image"]


class MyTagAdmin(admin.ModelAdmin):
    list_display = ['name',"category"]
admin.site.register(models.UserInfo)
admin.site.register(models.Post,PostAdmin)
admin.site.register(models.Rating)
admin.site.register(models.MyTag,MyTagAdmin)
