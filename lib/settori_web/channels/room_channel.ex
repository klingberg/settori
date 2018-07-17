defmodule SettoriWeb.RoomChannel do
  use Phoenix.Channel

  def join("room:lobby", _message, socket) do
    players = SettoriWeb.GameState.players()
    send(self, {:after_join, _message})
    {:ok, %{players: players}, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("player:move", %{"direction" => direction}, socket) do
    player_id = socket.assigns.player_id
    player = SettoriWeb.GameState.move_player(player_id, direction)
    # broadcast!(socket, "player:position", %{player: player})
    {:noreply, socket}
  end

  def handle_in("player:shoot", _, socket) do
    player_id = socket.assigns.player_id
    player = SettoriWeb.GameState.get_player(player_id)
    broadcast!(socket, "player:shoot", %{player: player})
    {:noreply, socket}
  end

  def handle_info({:after_join, _message}, socket) do
    player_id = socket.assigns.player_id
    player = %{id: player_id, x: 0, y: 0, turn: nil}
    player = SettoriWeb.GameState.put_player(player)
    broadcast!(socket, "player:joined", %{player: player})
    {:noreply, socket}
  end
end
