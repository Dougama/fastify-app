import { ProfileModel } from '../models/profiles.js';
import { publicImageUrl } from '@app/services/storage/save-image.js';
import { logger } from '@app/utils/logger.js';
import { IProfileRepository } from '../repositories/interfaces.js';

export class ProfileService {
  private profileModel: ProfileModel;

  constructor(private repository: IProfileRepository) {
    this.profileModel = new ProfileModel(repository);
  }

  async createProfile(profileData: Record<string, any>) {
    const profile = await this.profileModel.create(profileData);
    return { created: true, id: profile.id };
  }

  async updateProfile(id: string, profileData: Record<string, any>) {
    await this.profileModel.update(id, profileData);
    return { updated: true };
  }

  async deleteProfile(id: string) {
    return await this.profileModel.delete(id);
  }

  async getProfileByUserId(userId: string) {
    return await this.profileModel.getProfileByUserId(userId);
  }

  async createProfilePhoto(userId: string, imageData: Record<string, any>) {
    const url = await publicImageUrl(imageData.image, userId);
    if (!url) {
      logger.error('Error saving image');
      throw new Error('Error saving image');
    }

    const existingProfile = await this.profileModel.getProfileByUserId(userId);
    if (existingProfile) {
      await this.profileModel.update(existingProfile.id, { image: url });
    } else {
      await this.profileModel.create({ userId, image: url, bio: '' });
    }
    
    return { url };
  }
}
