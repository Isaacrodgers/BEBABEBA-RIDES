# lib/bebabeba_backend/web/plugs/rate_limit.ex

defmodule BebabebaBcakend.Web.Plugs.RateLimit do
  import Plug.Conn
  import Phoenix.Controller

  @max_requests 100
  @window_seconds 60

  def init(opts) do
    opts
  end

  def call(conn, _opts) do
    ip = get_client_ip(conn)
    key = "rate_limit:#{ip}"

    case Cachex.get(:rate_limit_cache, key) do
      {:ok, count} when count >= @max_requests ->
        conn
        |> put_status(:too_many_requests)
        |> put_view(BebabebaBcakend.Web.ErrorView)
        |> render("error.json", message: "Too many requests. Please try again later.")
        |> halt()

      {:ok, count} ->
        Cachex.expire(:rate_limit_cache, key, :timer.seconds(@window_seconds))
        Cachex.incr(:rate_limit_cache, key)
        conn

      {:error, _} ->
        Cachex.put(:rate_limit_cache, key, 1, expire: :timer.seconds(@window_seconds))
        conn
    end
  end

  defp get_client_ip(conn) do
    case Plug.Conn.get_req_header(conn, "x-forwarded-for") do
      [ip | _] -> ip
      [] -> elem(conn.remote_ip, 0) |> to_string()
    end
  end
end
