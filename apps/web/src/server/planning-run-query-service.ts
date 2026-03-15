import type {
  PlannerRunDetailRecord,
  PlannerRunRepository,
  PlannerRunSummaryRecord,
} from "@atlas-graph/db";

export type PlanningRunSummary = PlannerRunSummaryRecord;

export interface PlanningRunDetail {
  run: Omit<
    PlannerRunDetailRecord,
    "input" | "toolResults" | "output" | "errors"
  >;
  input: PlannerRunDetailRecord["input"];
  toolResults: PlannerRunDetailRecord["toolResults"];
  output: PlannerRunDetailRecord["output"];
  errors: PlannerRunDetailRecord["errors"];
}

export interface PlanningRunQueryService {
  listRecentRuns(): Promise<PlanningRunSummary[]>;
  listSavedRuns(): Promise<PlanningRunSummary[]>;
  saveRunById(id: string, name: string): Promise<void>;
  unsaveRunById(id: string): Promise<void>;
  getRunDetailById(id: string): Promise<PlanningRunDetail | null>;
  deleteRunById(id: string): Promise<void>;
}

export class DefaultPlanningRunQueryService implements PlanningRunQueryService {
  private readonly repository: PlannerRunRepository;

  public constructor(repository: PlannerRunRepository) {
    this.repository = repository;
  }

  public async listRecentRuns(): Promise<PlanningRunSummary[]> {
    return await this.repository.listRecentRuns();
  }

  public async listSavedRuns(): Promise<PlanningRunSummary[]> {
    return await this.repository.listSavedRuns();
  }

  public async saveRunById(id: string, name: string): Promise<void> {
    await this.repository.saveRun(id, name);
  }

  public async unsaveRunById(id: string): Promise<void> {
    await this.repository.unsaveRun(id);
  }

  public async deleteRunById(id: string): Promise<void> {
    await this.repository.deleteById(id);
  }

  public async getRunDetailById(id: string): Promise<PlanningRunDetail | null> {
    const record = await this.repository.findDetailById(id);

    if (!record) {
      return null;
    }

    const { input, output, toolResults, errors, ...run } = record;

    return {
      run,
      input,
      toolResults,
      output,
      errors,
    };
  }
}
