from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom, JoinRoom, UserInRoom, LeaveRoom, UpdateRoom


urlpatterns = [
    path('room', RoomView.as_view(), name='room'),  # Endpoint to list all rooms
    path('create-room', CreateRoomView.as_view(), name='create-room'),  # Endpoint to create a room
    path('get-room', GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('user-in-room', UserInRoom.as_view()),
    path('leave-room', LeaveRoom.as_view()),
    path('update-room',UpdateRoom.as_view())
]
