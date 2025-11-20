using UnityEngine;

namespace NotebookWar.Data
{
    [CreateAssetMenu(fileName = "PlayerStats", menuName = "NotebookWar/Player Stats")]
    public class PlayerStats : ScriptableObject
    {
        [Header("Health")]
        public float maxHealth = 100f;
        public float currentHealth = 100f;

        [Header("Armor")]
        public float maxArmor = 100f;
        public float currentArmor = 0f;

        [Header("Stamina")]
        public float maxStamina = 100f;
        public float currentStamina = 100f;
        public float staminaRegenRate = 10f;
        public float sprintStaminaCost = 20f;

        [Header("Movement")]
        public float walkSpeed = 5f;
        public float sprintSpeed = 8f;
        public float crouchSpeed = 2.5f;
        public float jumpForce = 5f;

        public void ResetToDefaults()
        {
            currentHealth = maxHealth;
            currentArmor = 0f;
            currentStamina = maxStamina;
        }
    }
}
