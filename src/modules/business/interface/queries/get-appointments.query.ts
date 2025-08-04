import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { UserRoleEnum } from "@/core/enums/enums";
import { Guard } from "@/core/utils";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { Appointment } from "@/modules/business/infrastructure/entities";
import { AppointmentRepository } from "@/modules/business/infrastructure/repositories";

export class GetAppointmentsQuery extends BaseQuery {
  userId: string;
  startDate?: string;
  endDate?: string;
  constructor(props: QueryProps<GetAppointmentsQuery>) {
    super(props);
    this.userId = props.userId;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }
}

export class GetAppointmentsQueryHandler extends BaseQueryHandler<GetAppointmentsQuery, Appointment[]> {
  async execute(query: GetAppointmentsQuery): Promise<Appointment[]> {
    const repository = AppointmentRepository.getInstance();
    const userRepository = UserRepository.getInstance();

    const user = await userRepository.findById(query.userId);
    if (!user) {
      throw new BaseError({
        statusCode: 404,
        message: "User not found",
      });
    }

    let appointments: Appointment[] = [];

    switch (user.role) {
      case UserRoleEnum.ADMIN:
      case UserRoleEnum.RESP_OPS:
        appointments = await repository.findAllEvenDeleted();
        break;
      case UserRoleEnum.FOURNISSEUR:
      case UserRoleEnum.AGENT_OPS:
      case UserRoleEnum.CLIENT:
      case UserRoleEnum.PARTNER:
        appointments = await repository.findBy({
          createdBy: user.id,
        });
        break;
      // TODO : Also retrieve for RESP_COM companies property appointment
      case UserRoleEnum.RESP_COM:
      case UserRoleEnum.AGENT_COM:
        appointments = await repository.findByOr([{ createdBy: user.id }, { agentId: user.id }]);
        break;
      default:
        appointments = [];
    }

    return appointments;
  }
}
