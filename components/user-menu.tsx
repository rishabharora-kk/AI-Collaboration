"use client"

import { signOut, useSession } from "next-auth/react"
import { LogOut, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function UserMenu() {
  const { data: session } = useSession()

  if (!session?.user) return null

  const getProviderBadge = () => {
    if (session.user.email?.includes("demo") || session.user.email?.includes("test")) {
      return (
        <Badge variant="secondary" className="text-xs">
          Demo Account
        </Badge>
      )
    }
    if (session.user.image?.includes("googleusercontent")) {
      return (
        <Badge variant="outline" className="text-xs">
          Google
        </Badge>
      )
    }
    if (session.user.image?.includes("github")) {
      return (
        <Badge variant="outline" className="text-xs">
          GitHub
        </Badge>
      )
    }
    return null
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 px-2 rounded-full hover:bg-muted">
          <div className="flex items-center space-x-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none truncate max-w-[150px]">{session.user.name || "User"}</p>
              {getProviderBadge()}
            </div>
            <p className="text-xs leading-none text-muted-foreground truncate">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
