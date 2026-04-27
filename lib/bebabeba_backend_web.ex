defmodule BebabebaBackendWeb do
  def controller do
    quote do
      use Phoenix.Controller, namespace: BebabebaBackendWeb
      import Plug.Conn
      alias BebabebaBackendWeb.Router.Helpers, as: Routes
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
