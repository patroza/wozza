import * as Route from "./+types.login"
import { type MetaFunction } from "react-router"
import { Effect, Option, Schema } from "effect"
import { Result } from "@wozza/react-router-effect"
import { Loader } from "~/main.server"
import { Sessions } from "~/services/Sessions"
import { Email, Credentials } from "@wozza/core"
import { Users } from "~/services/Users"
import { Form, Link } from "react-router"
import { Button } from "~/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"
import { Label } from "~/ui/label"
import { Input } from "~/ui/input"
import { HttpServerRequest } from "@effect/platform"

export const meta: MetaFunction = () => {
  return [{ title: "Login" }]
}

const credentialFromEmail = (email: Email) =>
  Credentials.OAuth({
    provider: "google",
    email,
    firstName: Option.none(),
    lastName: Option.none(),
    picture: Option.none()
  })

export const action = Loader.fromEffect(
  HttpServerRequest.schemaBodyForm(Schema.Struct({ email: Email })).pipe(
    Effect.flatMap((body) => Users.authenticate(credentialFromEmail(body.email))),
    Effect.flatMap(Sessions.mint),
    Effect.map(() => Result.Redirect("/")),
    Effect.orElseSucceed(() => Result.Json({ error: "Invalid email" }))
  )
)

export default function Login(props: Route.ComponentProps) {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  defaultValue="stephen@whatthebluck.com"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
