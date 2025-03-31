import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, LogIn } from 'lucide-react'
import GuestLayout from "@/components/layouts/GuestLayout"
import { visit } from "@/Utils/Functions"

export default function Maintenance() {
  return (
    <GuestLayout>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[350px] text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              Maintenance in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We're currently performing scheduled maintenance to improve our services. We'll be back shortly.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={(e) => visit(e, 'login')}>
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </GuestLayout>
  )
}
