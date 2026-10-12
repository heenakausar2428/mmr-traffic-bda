import hashlib
import math

class FlajoletMartin:
    """
    Flajolet-Martin (FM) Algorithm for sub-linear memory distinct element estimation.
    Uses binary trailing zero counting of hashed streaming event keys.
    """
    def __init__(self, num_hashes=4):
        self.num_hashes = num_hashes
        self.max_zeros = [0] * num_hashes
        self.actual_unique_set = set()
        self.total_processed = 0

    def _trailing_zeros(self, val: int) -> int:
        if val == 0:
            return 32
        count = 0
        while (val & 1) == 0:
            count += 1
            val >>= 1
        return count

    def _hash(self, item: str, seed: int) -> int:
        salted = f"{item}_{seed}".encode('utf-8')
        digest = hashlib.md5(salted).hexdigest()
        return int(digest, 16) & 0xFFFFFFFF

    def process_event(self, event_id: str):
        self.total_processed += 1
        self.actual_unique_set.add(event_id)
        
        for i in range(self.num_hashes):
            h_val = self._hash(event_id, seed=i * 1337 + 42)
            tz = self._trailing_zeros(h_val)
            if tz > self.max_zeros[i]:
                self.max_zeros[i] = tz

    def estimate(self):
        phi = 0.77351  # Flajolet-Martin correction factor
        estimates = [(2 ** R) / phi for R in self.max_zeros]
        # Use median of hash estimations for stability
        estimates.sort()
        mid = len(estimates) // 2
        if len(estimates) % 2 == 0:
            final_estimate = int((estimates[mid - 1] + estimates[mid]) / 2)
        else:
            final_estimate = int(estimates[mid])

        actual_count = len(self.actual_unique_set)
        error_pct = round(abs(final_estimate - actual_count) / max(actual_count, 1) * 100, 2)

        return {
            "total_stream_events": self.total_processed,
            "actual_distinct_events": actual_count,
            "fm_estimated_events": final_estimate,
            "estimation_error_percent": error_pct,
            "max_trailing_zeros_per_hash": self.max_zeros,
            "correction_factor_phi": phi,
            "status": "Active"
        }
