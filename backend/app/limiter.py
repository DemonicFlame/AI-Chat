from slowapi import Limiter

limiter = Limiter(key_func=lambda request: "global", default_limits=[])
