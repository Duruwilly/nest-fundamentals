import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ArtistsService } from 'src/artists/artists.service';
import { JwtAuthGuard } from 'src/auth/jwt-guard';

@Controller('users')
export class UsersController {
  constructor(private readonly artistsService: ArtistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('become-artist')
  async becomeArtist(@Req() req: any) {
    try {
      // Get user ID from the authenticated user's JWT token
      const userId = req.user.userId;
      console.log('userid', userId);

      // Call the updateUserToArtist method to update user to artist
      await this.artistsService.updateUserToArtist(userId);

      return { message: 'User updated to artist successfully' };
    } catch (error) {
      throw new Error(`Failed to update user to artist: ${error.message}`);
    }
  }
}
