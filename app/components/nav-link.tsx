import * as React from 'react'
import type { NavLinkProps } from '@remix-run/react'
import { NavLink as RemixNavLink } from '@remix-run/react'

export default function NavLink({ className, ...rest }: NavLinkProps) {
  return (
    <RemixNavLink
      {...rest}
    />
  )
}
