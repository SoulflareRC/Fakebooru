from .api import views

routes = [
    {"regex": r"userinfo", "viewset": views.UserInfoViewset, "basename": "UserInfo"},
    {"regex": r"post", "viewset":views.PostViewSet, "basename":"Post"},
    {"regex": r"tag", "viewset":views.MyTagViewSet, "basename":"Tag"},
    {"regex": r"rating", "viewset":views.RatingViewSet, "basename":"Post_Rating"},
    {"regex": r"vote", "viewset":views.CommentVoteViewSet, "basename":"Comment_Vote"},
    {"regex": r"profile", "viewset": views.UserInfoProfileViewset, "basename": "UserInfo_Profile"},
    {"regex": r"comment", "viewset": views.CommentViewSet, "basename": "Comment"},

]
