/**
 * Your app's signed-in user. Not part of Released: replace this with however
 * your app already knows who is signed in (session cookie, auth provider, …).
 */

export interface CurrentUser {
  /** Your stable, unique ID for the user. */
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

/**
 * TODO: replace with your real user lookup, returning `null` for signed-out
 * visitors.
 *
 * This demo always returns the same fictional user.
 */
export function getCurrentUser(): CurrentUser | null {
  return {
    id: "user_12345",
    email: "john.doe@doesnotexist.released.site",
    name: "John Doe",
    avatarUrl: "https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff",
  };
}
