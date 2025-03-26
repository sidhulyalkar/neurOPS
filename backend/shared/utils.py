import numpy as np

def load_trace(session_id, neuron_id):
    return np.array([0.2, 0.4, 0.5, 0.6])

def apply_filter(trace, filter_name):
    if filter_name == "zscore":
        return (trace - trace.mean()) / trace.std()
    return trace
