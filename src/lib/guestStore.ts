let guest = false

export const guestStore = {
  get: () => guest,
  set: (value: boolean) => {
    guest = value
  },
}
