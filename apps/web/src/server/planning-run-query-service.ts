import type {
  PlannerRunDetailRecord,
  PlannerRunRepository,
  PlannerRunSummaryRecord,
} from "@atlas-graph/db";

export interface PlanningRunSummary extends PlannerRunSummaryRecord {}

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
  getRunDetailById(id: string): Promise<PlanningRunDetail | null>;
}

export class DefaultPlanningRunQueryService implements PlanningRunQueryService {
  private readonly repository: PlannerRunRepository;

  public constructor(repository: PlannerRunRepository) {
    this.repository = repository;
  }

  public async listRecentRuns(): Promise<PlanningRunSummary[]> {
    return await this.repository.listRecentRuns();
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
