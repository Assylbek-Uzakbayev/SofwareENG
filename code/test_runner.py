import traceback

# Тексерілетін модульдер тізімі
modules = ['prompt_a', 'prompt_b', 'prompt_c', 'prompt_d']

test_cases = [
    ("Normal List", [40, 60, 80], 50),
    ("Single Mark", [100], 50),
    ("Boundary Float", [49.5, 50], 50),
    ("Empty List (Expect ValueError)", [], 50),
    ("Invalid Type (Expect ValueError)", [40, "60"], 50),
    ("Out of Range (Expect ValueError)", [-1, 50, 101], 50)
]

for mod in modules:
    print(f"\n=================== TESTING {mod}.py ===================")
    try:
        m = __import__(mod)
        func = getattr(m, 'analyze_marks')
        for title, marks, pass_m in test_cases:
            try:
                res = func(marks, pass_m)
                print(f"[{title}] Output: {res}")
            except Exception as e:
                print(f"[{title}] Exception: {type(e).__name__}: {e}")
    except Exception as e:
        print(f"Error importing {mod}: {e}")