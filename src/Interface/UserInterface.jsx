import { usePlayerStore } from "./Logic/usePlayerStore";
import { HealthBar, DashBar } from "./Inventory";

export default function UserInterface() {
    const stats = usePlayerStore((state) => state.stats);

    return (
        <div className="absolute inset-0">
            <HealthBar  health={stats.health} />
            <DashBar  dashes={stats.dashes} />
        </div>
    );
}