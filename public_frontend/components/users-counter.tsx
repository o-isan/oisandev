"use client"

import { useEffect, useState } from "react"
import { getUsers } from "@/actions/get/get_users"

export function UsersCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const data = await getUsers(1)
      setCount(data.count)
    }

    load()
  }, [])

  if (count === null) return <span>...</span>

  return <span>{count}</span>
}
