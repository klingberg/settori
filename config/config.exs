# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :settori,
  ecto_repos: [Settori.Repo]

# Configures the endpoint
config :settori, SettoriWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "ZGvCzV92ijGU5OVHeen12wJAf6ICmVuhmD5MHkfC9prgH04UWpL1INkiTwZs+FRd",
  render_errors: [view: SettoriWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Settori.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
