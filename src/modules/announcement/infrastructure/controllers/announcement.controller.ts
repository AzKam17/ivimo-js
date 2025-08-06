import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import Elysia from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";
import { CreateAnnouncementCommand, CreateAnnouncementCommandHandler } from "../../interface/commands";
import { routes } from "../../routes";
import { Announcement } from "../entities";
import { AnnouncementResponse } from "../../interface/responses";
import { ListAnnouncementQuery, ListAnnouncementQueryHandler } from "../../interface/queries";
import { CreateAnnouncementDto, UpdateAnnouncementDto } from "../../interface/dto";
import { EditAnnouncementQuery, EditAnnouncementQueryHandler } from '../../interface/commands/edit-announcement.command';
import { ActiveAnnouncementQuery, ActiveAnnouncementQueryHandler, DiseableAnnouncementQuery, DiseableAnnouncementQueryHandler } from "../../interface/queries";

export const AnnouncementController: Elysia = new Elysia()
  .use(({ decorator }) => {
    return cqrs({
      commands: [
        [CreateAnnouncementCommand, new CreateAnnouncementCommandHandler()],
      ],
      queries: [
        [ListAnnouncementQuery, new ListAnnouncementQueryHandler()],
        [ActiveAnnouncementQuery, new ActiveAnnouncementQueryHandler()],
        [DiseableAnnouncementQuery, new DiseableAnnouncementQueryHandler()],
        [EditAnnouncementQuery, new EditAnnouncementQueryHandler()]
      ]
    });
  })
  .use(AuthRoutesPlugin)

  // create announcement
  .post(
    routes.announcement_auth.root,
    async ({ body, user, commandMediator }: { body: any; user: User; commandMediator: CommandMediator }) => {
      const result: Announcement = await commandMediator.send(
        new CreateAnnouncementCommand({
          announcementObject: body,
          user
        })
      );

      return () => new AnnouncementResponse({ ...result });
    },
    {
      body: CreateAnnouncementDto,
      detail: {
        summary: "Create - create announcement",
        tags: ["Announcement"],
      }
    }
  )
  // list announcement
  .get(routes.announcement_auth.root, async ({ query, user, queryMediator }: { queryMediator: QueryMediator, user: User, query: any }) => {
    const result = await queryMediator.send(new ListAnnouncementQuery({ currentUser: user, params: query }));
    return () => result;
  }, {
    detail: {
      summary: "Get all announcement",
      tags: ["Announcement"],
      parameters: [
        {
          name: "page",
          in: 'query',
          description: "Page number for pagination (default: 1)",
          required: false,
          schema: {
            type: "number",
          }
        },
        {
          name: "limit",
          in: 'query',
          description: "Number of items per page",
          required: false,
          schema: {
            type: "number",
          }
        },
      ]
    },
  })
  // update annoouncement
  .put(
    routes.announcement_auth.detail,
    async ({ params: { id }, queryMediator, body, user }: { queryMediator: QueryMediator, body: any, params: any, user: User }) => {
      const result: Announcement = await queryMediator.send(
        new EditAnnouncementQuery({
          announcementObject: body,
          id,
          user
        })
      );

      return () => new AnnouncementResponse({ ...result });
    },
    {
      body: UpdateAnnouncementDto,
      detail: {
        summary: "Edit - edit announcement",
        tags: ["Announcement"],
      }
    }
  )
  // active
  .get(
    routes.announcement_auth.active,
    async ({ params: { id }, queryMediator, user }: { queryMediator: QueryMediator, params: any, user: User }) => {
      const result = await queryMediator.send(new ActiveAnnouncementQuery({ user, id }));
      return () => new AnnouncementResponse(result);
    }, {
    detail: {
      summary: "Active - active announcement",
      tags: ["Announcement"],
    }
  })
  // diseable
  .get(
    routes.announcement_auth.diseable,
    async ({ params: { id }, queryMediator, user }: { queryMediator: QueryMediator, params: any, user: User }) => {
      console.log('user current => ', id, user)
      const result = await queryMediator.send(new DiseableAnnouncementQuery({ user, id }));
      return () => new AnnouncementResponse(result);
    }, {
    detail: {
      summary: "Diseable - diseable announcement",
      tags: ["Announcement"],
    }
  })
