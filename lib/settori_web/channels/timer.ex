defmodule SettoriWeb.Timer do
  use GenServer

  @timedelay 1000

  def start_link(name \\ nil) do
    GenServer.start_link(__MODULE__, %{}, name: :timer)
  end

  def init(_) do
    timer_ref = Process.send_after(self(), :tick, @timedelay)
    {:ok, %{turn: 0, timer: timer_ref}}
  end

  def handle_info(:tick, state) do
    players = SettoriWeb.GameState.players()
    SettoriWeb.Endpoint.broadcast!("room:lobby", "update:players", %{players: players})

    timer_ref = Process.send_after(self(), :tick, @timedelay)
    turn = if state.turn < 999, do: state.turn + 1, else: 0

    {:noreply, %{turn: turn, timer: timer_ref}}
  end

  # CLient API

  def get_turn() do
    GenServer.call(:timer, :get_turn)
  end

  # Server Callbacks

  def handle_call(:get_turn, _from, state) do
    {:reply, state.turn, state}
  end
end
