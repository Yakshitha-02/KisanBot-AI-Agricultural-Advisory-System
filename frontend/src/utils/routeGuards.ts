export function requireAuth(role?: 'farmer' | 'admin') {
  return (user: { role: string } | null) => {
    if (!user) {
      return false;
    }
    return role ? user.role === role : true;
  };
}
