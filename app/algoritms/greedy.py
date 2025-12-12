import time


def solve_assignment(cost_matrix: list[list[int]]) -> dict:
    
    if not cost_matrix:
        return {
            "assignment": [],
            "total_cost": 0,
            "time_ms": 0.0
        }
        
    n = len(cost_matrix)
    
    if not cost_matrix[0]:
        return {
            "assignment": [],
            "total_cost": 0,
            "time_ms": 0.0
        }
    
    m = len(cost_matrix[0])
    
    if n != m:
        return {
            "assignment": [],
            "total_cost": 0,
            "time_ms": 0.0
        }
    
    for i in range(1, n):
        if len(cost_matrix[i]) != m:
            return {
                "assignment": [],
                "total_cost": 0,
                "time_ms": 0.0
            }
            
    start_time = time.perf_counter()

    assignments = []
    for i in range(n):
        for j in range(n):
            cost = cost_matrix[i][j]
            assignments.append((cost, i, j))
    
   
    assignments.sort(key=lambda x: x[0])


    worker_assigned = [False] * n
    task_assigned = [False] * n 
    result_assignment = []
    total_cost = 0 

    for cost, i, j in assignments:
        if not worker_assigned[i] and not task_assigned[j]:
            result_assignment.append((i, j))
            total_cost += cost
            

            worker_assigned[i] = True
            task_assigned[j] = True
            
            if len(result_assignment) == n:
                break

    end_time = time.perf_counter()
    elapsed_time_ms = (end_time - start_time) * 1000


    return {
        "assignment": result_assignment,
        "total_cost": total_cost,
        "time_ms": elapsed_time_ms
    }