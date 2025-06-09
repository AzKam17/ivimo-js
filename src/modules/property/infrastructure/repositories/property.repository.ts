import { BaseRepository } from "@/core/infrastructure/repositories";
import { Property } from "@/modules/property/infrastructure/entities";

export class PropertyRepository extends BaseRepository<Property> {
  private static instance: PropertyRepository;

  private constructor() {
    super(Property);
  }

  public static getInstance(): PropertyRepository {
    if (!PropertyRepository.instance) {
      PropertyRepository.instance = new PropertyRepository();
    }
    return PropertyRepository.instance;
  }

  async increaseViews(id: string): Promise<boolean> {
    return await this.repository.manager.transaction(async transactionalEntityManager => {
      // Find with pessimistic write lock
      const property = await transactionalEntityManager.findOne(this.repository.target, {
        where: { id },
        lock: { mode: 'pessimistic_write' }
      });
  
      if (!property) {
        return false;
      }
  
      // Update the views count
      await transactionalEntityManager.update(this.repository.target, 
        { id }, 
        { views: property.views + 1 }
      );
  
      return true;
    });
  }

  /**
   * Get recommended properties within a specific radius (in meters)
   */
  async getRecommendedPropertiesWithinRadius(
    id: string, 
    radiusMeters: number = 5000
  ): Promise<Property[]> {
    const referenceProperty = await this.repository.findOne({
      where: { id },
    });

    if (!referenceProperty || !referenceProperty.geolocation) {
      return [];
    }

    const refCoordinates = this.extractCoordinates(referenceProperty.geolocation);
    if (!refCoordinates) {
      return [];
    }

    const [refLng, refLat] = refCoordinates;

    return await this.repository
      .createQueryBuilder('property')
      .where('property.id != :id', { id })
      .andWhere('property.geolocation IS NOT NULL')
      .andWhere(
        `ST_DistanceSphere(
          property.geolocation, 
          ST_GeomFromGeoJSON(:refPoint)
        ) <= :radius`,
        {
          refPoint: JSON.stringify({
            type: 'Point',
            coordinates: [refLng, refLat]
          }),
          radius: radiusMeters
        }
      )
      .orderBy(
        `ST_DistanceSphere(
          property.geolocation, 
          ST_GeomFromGeoJSON(:refPoint)
        )`,
        'ASC'
      )
      .limit(5)
      .getMany();
  }

  /**
   * Extract coordinates from GeoJSON geometry
   * Handles both Point and other geometry types
   */
  private extractCoordinates(geolocation: any): [number, number] | null {
    if (!geolocation || !geolocation.coordinates) {
      return null;
    }

    // Handle Point geometry
    if (geolocation.type === 'Point') {
      const [lng, lat] = geolocation.coordinates;
      return [lng, lat];
    }

    // Handle Polygon - use centroid of first ring
    if (geolocation.type === 'Polygon') {
      const coordinates = geolocation.coordinates[0];
      if (coordinates && coordinates.length > 0) {
        // Simple centroid calculation
        const sumLng = coordinates.reduce((sum: number, coord: number[]) => sum + coord[0], 0);
        const sumLat = coordinates.reduce((sum: number, coord: number[]) => sum + coord[1], 0);
        return [sumLng / coordinates.length, sumLat / coordinates.length];
      }
    }

    // Handle other geometry types by taking first coordinate
    if (Array.isArray(geolocation.coordinates) && geolocation.coordinates.length >= 2) {
      const firstCoord = geolocation.coordinates[0];
      if (Array.isArray(firstCoord) && firstCoord.length >= 2) {
        return [firstCoord[0], firstCoord[1]];
      }
    }

    return null;
  }
}
