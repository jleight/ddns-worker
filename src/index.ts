const responses = {
  json(content: any, status = 200) {
    return new Response(JSON.stringify(content), {
      status,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
  },
  notFound() {
    return new Response("Resource not found.", { status: 404 });
  },
  error(error: string, status = 500) {
    return responses.json({ error }, status);
  },
};

export default {
  async fetch(request: Request): Promise<Response> {
    const { protocol, pathname, searchParams } = new URL(request.url);

    if (protocol !== "https:") {
      return responses.error("Request must be made over HTTPS.", 400);
    }
    if (pathname !== "/update") {
      return responses.notFound();
    }

    const authorization = request.headers.get("Authorization");
    if (!authorization) {
      return responses.error("Missing Authorization header.", 401);
    }

    let recordName: string;
    let authToken: string;
    try {
      [recordName, authToken] = atob(authorization.split(" ")[1]).split(":");
    } catch (e) {
      return responses.error("Invalid Authorization header.", 401);
    }

    const zoneId = searchParams.get("z");
    if (!zoneId) {
      return responses.error("Missing zone ID (z) query parameter.", 400);
    }

    const recordId = searchParams.get("r");
    if (!zoneId) {
      return responses.error("Missing record ID (r) query parameter.", 400);
    }

    const ip = searchParams.get("i");
    if (!ip) {
      return responses.error("Missing IP address (i) query parameter.", 400);
    }

    try {
      await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "A",
            name: recordName,
            content: ip,
            proxied: false,
            ttl: 1,
            tags: [],
            comment: `Last updated: ${new Date().toISOString()}`,
          }),
        },
      );
    } catch (e) {
      console.error(e);
      return responses.error("Failed to update DNS record.", 500);
    }

    return responses.json({ success: true });
  },
};
