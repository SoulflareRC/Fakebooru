from rest_framework import permissions
class RatingPermission(permissions.BasePermission):
    # a generic permission for all "rating" objects
    def has_object_permission(self, request, view, obj):
        # has_object_permission only gets called on get_object()!!!
        action = view.action
        user = request.user

        print("Action: ",view.action)
        print("User: ",user,user.is_authenticated)
        if action == "list":
            # only staffs can see who voted what
            # return user.is_staff
            return True
        elif action == "create":
            # only authenticated users can vote
            return user.is_authenticated
        elif action in ['retrieve','update','partial_update']:
            # only staff/self can retrieve/update
            return obj.by == user or user.is_staff
        else:
            # don't allow destroy once voted?
            return False
    def has_permission(self, request, view):
        action = view.action
        user = request.user
        query_params = request.query_params
        print(query_params)

        if action == "list":
            # only staffs can see who voted what
            by = query_params.get('by')
            # print("By:",by," User pk:",user.pk)
            if by is not None and user.is_authenticated and int(by) == user.pk:
                # print("Allowed")
                return True
            return user.is_staff
        elif action == "create":
            # only authenticated users can vote
            return user.is_authenticated
        else:
            return False
class CommentPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        action = view.action
        user = request.user
        if action in ['list','retrieve']:
            # everyone can see the list of comments!
            return True
        elif action in ['update','partial_update','create']:
            # only authenticated user can make and edit a comment(only editing content is allowed? or just disallow editing?)
            return user.is_authenticated
        elif action == 'destroy':
            # only self or staffs can delete a comment
            return obj.user==user or user.is_staff
        return False
    # def has_permission(self, request, view):
    #     action = view.action
    #     user = request.user
    #     if action in ['list', 'retrieve']:
    #         # everyone can see the list of comments!
    #         return True
    #     elif action == 'create':
    #         return user.is_authenticated
    #     else:
    #         return False
class PostPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        action = view.action
        user = request.user
        if action in ['list','retrieve','count']:
            # everyone can see the list of the posts!
            return True
        elif action in ['update','partial_update','create','save']:
            # only authenticated user can make a post, edit a post
            return user.is_authenticated
        elif action == 'destroy':
            # only self or staffs can destroy
            return obj.uploader==user or user.is_staff
        return False

class UserInfoPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        action = view.action
        user = request.user
        '''
        list:staff only
        retrieve:everyone
        create,destroy:nah.
        update,partial_update:self only
        '''
        print("Detail Action:",action," User:",user)
        if action == 'list':
            return user.is_staff
        if action == 'retrieve':
            return True
        elif action in ['create','destroy']:
            # users aren't allowed to create userinfo
            return False
        elif action in ['update','partial_update']:
            # only self or staffs can do these
            print("Permission?",obj.user == user)
            return obj.user == user
        elif action == 'current':
            return user.is_authenticated
        return False

class TagPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        action = view.action
        user = request.user
        if action in ['list', 'retrieve']:
            # everyone can see the list of the tags!
            return True
        return user.is_authenticated
