import { executeMonthlyRaffleCron } from "../lib/cron/raffle-cron";

async function main() {
  console.log("==================================================");
  console.log("   SMART CHEF - MONTHLY RAFFLE CRON RUNNER       ");
  console.log("==================================================");

  // Parse command-line flags (e.g. --force, --month=8, --year=2026)
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const monthArg = args.find((a) => a.startsWith("--month="));
  const yearArg = args.find((a) => a.startsWith("--year="));

  const overrideMonth = monthArg ? parseInt(monthArg.split("=")[1], 10) : undefined;
  const overrideYear = yearArg ? parseInt(yearArg.split("=")[1], 10) : undefined;

  const result = await executeMonthlyRaffleCron({
    force,
    overrideMonth,
    overrideYear,
  });

  console.log("\nExecution Result:");
  console.log(JSON.stringify(result, null, 2));

  if (result.success) {
    console.log("\n✅ Raffle execution completed successfully!");
  } else {
    console.log(`\nℹ️  Raffle execution note: ${result.message}`);
  }

  process.exit(result.success ? 0 : 1);
}

main().catch((err) => {
  console.error("Fatal error during raffle execution:", err);
  process.exit(1);
});
