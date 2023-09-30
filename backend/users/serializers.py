from rest_framework import serializers
from .models import User
class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email','password')
    # def create(self, validated_data):
    #     password = validated_data.pop('password',None)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email']
