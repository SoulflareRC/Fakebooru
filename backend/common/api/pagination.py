from rest_framework import pagination
class StandardPagination(pagination.PageNumberPagination):
    '''Normally, 30 objects/page '''
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 100
