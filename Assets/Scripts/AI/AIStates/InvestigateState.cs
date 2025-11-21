using UnityEngine;

namespace NotebookWar.AI
{
    public class InvestigateState : IEnemyState
    {
        private EnemyBase enemy;
        private Vector3 lastKnownPlayerPosition;
        private float investigateTime = 5f;
        private float investigateTimer = 0f;
        private bool hasReachedPosition = false;

        public InvestigateState(EnemyBase enemyBase)
        {
            enemy = enemyBase;
            lastKnownPlayerPosition = enemy.GetPlayer().position;
        }

        public void Enter()
        {
            enemy.MoveTo(lastKnownPlayerPosition);
            investigateTimer = 0f;
            hasReachedPosition = false;
        }

        public void Update()
        {
            // Check if player is still visible
            if (enemy.CanSeePlayer())
            {
                // Transition to engage state - will need state machine reference
                return;
            }

            // Check if reached investigation point
            if (!hasReachedPosition && HasReachedDestination())
            {
                hasReachedPosition = true;
                enemy.StopMoving();
            }

            // Count down investigation time
            if (hasReachedPosition)
            {
                investigateTimer += Time.deltaTime;
                
                // Look around for player
                LookAround();

                if (investigateTimer >= investigateTime)
                {
                    // Return to patrol - will need state machine reference
                    return;
                }
            }
        }

        public void Exit()
        {
            enemy.StopMoving();
        }

        private void LookAround()
        {
            // Rotate the enemy to look around
            float rotationSpeed = 45f; // degrees per second
            enemy.transform.Rotate(0, rotationSpeed * Time.deltaTime, 0);
        }

        private bool HasReachedDestination()
        {
            if (enemy.GetAgent() == null) return true;
            
            return !enemy.GetAgent().pathPending && 
                   enemy.GetAgent().remainingDistance < 1f;
        }
    }
}