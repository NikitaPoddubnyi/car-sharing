import { Injectable, NotFoundException } from "@nestjs/common";
import { getPublicId } from "src/common/helpers";
import { CloudinaryService } from "src/infra/claudinary/claudinary.service";
import { PrismaService } from "src/infra/prisma/prisma.service";

@Injectable()
export class PurgeUserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly cloudinary: CloudinaryService
	) {}

	 async purgeUserData(userId: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: {
        avatar: true,
        license: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const publicIdsToDelete: string[] = [];

    if (user.avatar?.url) {
      publicIdsToDelete.push(getPublicId(user.avatar.url));
    }

    if (user.license) {
      if (user.license.frontImage)
        publicIdsToDelete.push(getPublicId(user.license.frontImage));
      if (user.license.backImage)
        publicIdsToDelete.push(getPublicId(user.license.backImage));
    }

    if (publicIdsToDelete.length > 0) {
      await Promise.allSettled(
        publicIdsToDelete.map((id) =>
          this.cloudinary.deleteFile(id).catch(() => {}),
        ),
      );
    }

    await this.prismaService.user.delete({
      where: { id: userId },
    });
  }
}