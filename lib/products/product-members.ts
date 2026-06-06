import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"
import type { ProductMemberRole } from "@/generated/prisma/client"

export { parseInviteEmails } from "./product-invite-utils"

export function newInviteToken(): string {
  return randomBytes(9).toString("base64url")
}

export async function createProductInvites(
  productId: string,
  emails: string[],
  role: ProductMemberRole = "EDITOR"
) {
  const unique = [...new Set(emails)]
  const created = []

  for (const email of unique) {
    try {
      const member = await prisma.productMember.upsert({
        where: { productId_email: { productId, email } },
        create: {
          productId,
          email,
          role,
          status: "PENDING",
          inviteToken: newInviteToken(),
        },
        update: {},
      })
      created.push(member)
    } catch {
      /* skip duplicates */
    }
  }

  return created
}
