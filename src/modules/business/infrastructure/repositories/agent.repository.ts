import { BaseRepository } from "@/core/infrastructure/repositories";
import { Agent } from "@/modules/business/infrastructure/entities";

export class AgentRepository extends BaseRepository<Agent> {
  private static instance: AgentRepository;

  private constructor() {
    super(Agent);
  }

  public static getInstance(): AgentRepository {
    if (!AgentRepository.instance) {
      AgentRepository.instance = new AgentRepository();
    }
    return AgentRepository.instance;
  }
}
