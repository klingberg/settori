defmodule SettoriWeb.PageController do
  use SettoriWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
