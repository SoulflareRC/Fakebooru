from .api import views

routes = [
    {"regex": r"userinfo", "viewset": views.UserInfoViewset, "basename": "userinfo"},
    {"regex": r"post", "viewset":views.PostViewSet, "basename":"post"},
    {"regex": r"tag", "viewset":views.MyTagViewSet, "basename":"tag"},
    {"regex": r"rating", "viewset":views.RatingViewSet, "basename":"post_rating"},
    {"regex": r"vote", "viewset":views.CommentVoteViewSet, "basename":"comment_vote"},
    {"regex": r"profile", "viewset": views.UserInfoProfileViewset, "basename": "userinfo_profile"},
    {"regex": r"comment", "viewset": views.CommentViewSet, "basename": "comment"},

]
