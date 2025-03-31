import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, LogIn } from 'lucide-react'
import GuestLayout from "@/components/layouts/GuestLayout"
import { visit } from "@/Utils/Functions"

export default function RestrictedAccess() {
  return (
    <GuestLayout>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[350px] text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You are not allowed to access this page. Please contact the administrator.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            
          </CardFooter>
        </Card>
      </div>
    </GuestLayout>
  )
}
