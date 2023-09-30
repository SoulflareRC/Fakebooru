from django.http import QueryDict
from rest_framework.filters import BaseFilterBackend
from datetime import datetime,timedelta
class QueryParamFilterBackend(BaseFilterBackend):
    query_fields = None
    def filter_queryset(self, request, queryset, view):
        valid_fields = getattr(view, 'query_fields', self.query_fields)
        query_dict: QueryDict = request.query_params
        query_keys = query_dict.keys()
        # print('Query params:',query_keys)
        # print("Allowed query fields:",valid_fields)

        model_fields = view.get_serializer().Meta.model._meta.get_fields()
        # print("Model fields:",model_fields)
        final_fields = query_keys & valid_fields
        # print("Final fields:", final_fields)
        for field in model_fields:
                field_name = field.name
                query_value = query_dict.get(field_name)
                if field_name in final_fields and query_value:
                    queryset = queryset.filter(**{field_name: query_value})
        return queryset
class PublishDateFilterBackend(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        last_day = request.query_params.get('last_day', None)
        last_week = request.query_params.get('last_week', None)
        last_month = request.query_params.get('last_month', None)

        if last_day:
            start_date = datetime.now() - timedelta(days=1)
            queryset = queryset.filter(publish_date__gte=start_date)

        if last_week:
            start_date = datetime.now() - timedelta(weeks=1)
            queryset = queryset.filter(publish_date__gte=start_date)

        if last_month:
            start_date = datetime.now() - timedelta(days=30)
            queryset = queryset.filter(publish_date__gte=start_date)

        return queryset
class TagFilterBackend(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        tags = request.query_params.getlist('tags')
        if tags:
            print("Got tags:",tags)
            for tag in tags:
                print(tag)
            queryset = queryset.filter(tags__name__in=tags).distinct()
            print("Queryset:",queryset)
        return queryset
