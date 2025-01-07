import { syncUsers, User as GleanUser } from './glean/index.js';
import { getUsers, User as SlabUser } from './slab/index.js';
import { DataSource } from './datasource.js';

const mapUserToGlean = (user: SlabUser): GleanUser => ({
  name: user.name,
  email: user.email,
  userId: user.id,
  isActive: !user.deactivatedAt,
});

export const ingestSlabUsers = async (uploadId: string) => {
  try {
    console.info('Fetching users from Slab');
    const users = await getUsers();

    console.info('Syncing Slab users to Glean');
    await syncUsers(users.map(mapUserToGlean), DataSource.name, uploadId);
    
    console.info('Finished users sync');
  } catch (error) {
    console.error('Unable to fetch users from Slab');
    console.trace(error);
  }
};
