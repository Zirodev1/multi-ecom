import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { User } from '@prisma/client'
import { clerkClient } from '@clerk/nextjs/server'
import { db } from '../../../lib/db'

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type

   if (evt.type === 'user.created' || evt.type === 'user.updated') {
    const data = evt.data;
    const user: Partial<User> = {
      id: data.id,
      email: data.email_addresses[0].email_address,
      name: data.first_name + ' ' + data.last_name,
      imageUrl: data.image_url,
    }

    if (!user) return;

    const dbUser = await db.user.upsert({
      where: {
        email: user.email,
      },
      update: user,
      create: {
        id: user.id!,
        email: user.email!,
        name: user.name!,
        imageUrl: user.imageUrl!,
        role: user.role || 'USER',
      },
    });

    console.log('User id:', data.id);
    
    try {
      // In Next.js App Router, we need to await the clerkClient first
      if (evt.type === "user.created") {
        const client = await clerkClient();
        await client.users.updateUserMetadata(data.id, {
            privateMetadata: {
              role: dbUser.role || "USER",
            },
        });
    }
      console.log('Successfully updated Clerk metadata');
    } catch (error) {
      console.error('Error updating Clerk metadata:', error);
    }
  }

  if (evt.type === 'user.deleted') {
    const data = evt.data;
    const user: Partial<User> = {
      id: data.id,
    }
    
  }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}