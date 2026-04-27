defmodule Bebabeba.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      Bebabeba.Repo,
      {Phoenix.PubSub, name: Bebabeba.PubSub},
      BebebabaWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: Bebabeba.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    BebebabaWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
