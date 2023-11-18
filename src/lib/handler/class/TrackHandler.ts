import { GuildQueue } from 'discord-player';
import { ChatInputCommandInteraction } from 'discord.js';
import {
  PlayHandler,
  QueueHandler,
  RepeatHandler,
  StopHandler,
  SkipHandler,
  ShuffulHandler,
} from '@/lib/handler/command/track/index';

export class TrackHandler {
  private interaction: ChatInputCommandInteraction;
  private queue: GuildQueue<unknown> | null;

  public constructor(
    interaction: ChatInputCommandInteraction,
    queue: GuildQueue<unknown> | null
  ) {
    this.interaction = interaction;
    this.queue = queue;
  }

  public PlayHandler = () => PlayHandler(this.interaction, this.queue);

  public QueueHandler = () => QueueHandler(this.interaction, this.queue);

  public RepeatHandler = () => RepeatHandler(this.interaction, this.queue);

  public StopHandler = () => StopHandler(this.interaction, this.queue);

  public SkipHandler = () => SkipHandler(this.interaction, this.queue);

  public ShuffulHandler = () => ShuffulHandler(this.interaction, this.queue);
}
