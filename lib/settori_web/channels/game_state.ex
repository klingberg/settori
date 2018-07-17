defmodule SettoriWeb.GameState do
  @doc """
    Used by the supervisor to start the Agent that will keep the game state persistent.
   The initial value passed to the Agent is an empty map.
  """
  def start_link do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  @doc """
   Put a new player in the map
  """
  def put_player(player) do
    Agent.update(__MODULE__, &Map.put_new(&1, player.id, player))
    player
  end

  @doc """
    Retrieve a player from the map
  """
  def get_player(player_id) do
    Agent.get(__MODULE__, &Map.get(&1, player_id))
  end

  @doc """
    Update the player information in the map
  """
  def update_player(player) do
    Agent.update(__MODULE__, &Map.put(&1, player.id, player))
    player
  end

  @doc """
   Get all the players in the map
  """
  def players do
    Agent.get(__MODULE__, & &1)
  end

  def move_player(player_id, direction) do
    turn = SettoriWeb.Timer.get_turn()

    delta =
      case direction do
        "RIGHT" ->
          %{x: 1, y: 0}

        "LEFT" ->
          %{x: -1, y: 0}

        "UP" ->
          %{x: 0, y: -1}

        "DOWN" ->
          %{x: 0, y: 1}

        _ ->
          %{x: 0, y: 0}
      end

    player = get_player(player_id)

    new_position(player, player.turn, turn, delta)
    |> update_player

    # player_id
    # |> get_player
    # |> new_position(delta, turn)
    # |> update_player
  end

  defguard allowed?(player_turn, turn) when player_turn != turn

  defp new_position(player, player_turn, turn, delta) when allowed?(player_turn, turn) do
    player
    |> Map.update!(:x, &(&1 + delta.x))
    |> Map.update!(:y, &(&1 + delta.y))
    |> Map.put(:turn, turn)
  end

  defp new_position(player, player_turn, turn, delta), do: player
end
