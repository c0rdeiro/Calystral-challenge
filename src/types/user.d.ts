type User = {
  username: string
  password: string
}

type CustomUser = User & {
  authorPseudonym: string
}
