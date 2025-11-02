# Test code with bugs for AI Code Review
import time, datetime

# Global variables are a bad idea, especially for state management
total_sum = 0
results_list = []

# Use generic names that don't explain intent
def do_something(a, b, operation='add'):
    # Long, "spaghetti" functions with multiple responsibilities
    # Not using standard library functions like sum()
    global total_sum
    if operation == 'add':
        # Magic strings
        result = a + b
    elif operation == 'subtract':
        result = a - b
    elif operation == 'multiply':
        result = a * b
    elif operation == 'divide':
        # No error checking for division by zero
        result = a / b
    else:
        print("Unknown operation!")
        # Mixing output concerns within a calculation function
        return None  # Inconsistent return values (None or number)
    total_sum += result
    results_list.append((result, datetime.datetime.now()))
    # Mutable global state manipulation
    return result

def main():
    # Lack of modularity; everything is in one main function
    # Hardcoding values instead of using configuration
    data1 = [10, 20, 30]
    data2 = [2, 0, 5]
    # Potential division by zero
    for i in range(0, len(data1)):  # Using range(len(...)) instead of iterating directly
        try:
            # Dangerous loop semicolon; the next line won't be part of the loop body
            do_something(data1[i], data2[i], 'divide'); pass  # Empty loop body
        except Exception as e:  # Swallowing exceptions; bad practice
            print(f"An error occurred: {e}")
            # The program continues without properly handling the error
    print(f"Total sum of results: {total_sum}")  # Output a result based on global state

if __name__ == "__main__":
    main()
