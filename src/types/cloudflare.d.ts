type PagesFunction<Env = Record<string, string | undefined>> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;
